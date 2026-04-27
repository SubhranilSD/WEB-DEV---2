import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

let modelsLoaded = false;

export async function loadFaceModels() {
  if (modelsLoaded) return true;
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
    modelsLoaded = true;
    return true;
  } catch (err) {
    console.error("Failed to load face-api models", err);
    return false;
  }
}

// Helper to convert base64 data URL to an HTMLImageElement
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Extracts face descriptors and crops from an image URL
async function getFacesFromImage(imageUrl) {
  try {
    const img = await createImage(imageUrl);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    
    // Create a canvas to extract circular crops of the faces
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    return detections.map(d => {
      const box = d.detection.box;
      
      // Add padding to bounding box
      const pad = Math.max(box.width, box.height) * 0.2;
      const x = Math.max(0, box.x - pad);
      const y = Math.max(0, box.y - pad);
      const w = Math.min(img.width - x, box.width + pad * 2);
      const h = Math.min(img.height - y, box.height + pad * 2);
      
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = 150;
      faceCanvas.height = 150;
      const fCtx = faceCanvas.getContext('2d');
      
      // Draw circular crop
      fCtx.beginPath();
      fCtx.arc(75, 75, 75, 0, Math.PI * 2);
      fCtx.clip();
      fCtx.drawImage(canvas, x, y, w, h, 0, 0, 150, 150);
      
      return {
        descriptor: d.descriptor,
        faceUrl: faceCanvas.toDataURL('image/jpeg', 0.8)
      };
    });
  } catch (err) {
    console.error("Face detection failed for image", err);
    return [];
  }
}

/**
 * Scans all events, detects faces, and clusters them using Euclidean distance.
 * Returns an array of Clusters (Persons).
 */
export async function processEventsForFaces(events, onProgress) {
  const allFaces = []; // { eventId, descriptor, faceUrl }
  
  let totalProcessed = 0;
  
  // Extract all faces
  for (const event of events) {
    if (!event.media || event.media.length === 0) continue;
    
    for (const media of event.media) {
      if (media.type !== 'image') continue;
      
      const faces = await getFacesFromImage(media.url);
      faces.forEach(f => {
        allFaces.push({ eventId: event._id, ...f });
      });
    }
    
    totalProcessed++;
    if (onProgress) onProgress((totalProcessed / events.length) * 50); // first 50% is extraction
  }
  
  // Cluster faces
  const clusters = []; // array of { id, descriptors: [], faceUrl, eventIds: Set, name: '' }
  const THRESHOLD = 0.55; // Lower is stricter matching. 0.6 is default for face-api
  
  for (let i = 0; i < allFaces.length; i++) {
    const face = allFaces[i];
    let matchedCluster = null;
    
    // Find closest cluster
    let minDistance = 1.0;
    
    for (const cluster of clusters) {
      // Compare against the average descriptor of the cluster (or just the first one)
      // For simplicity, we compare against all descriptors in cluster and take min distance
      for (const desc of cluster.descriptors) {
        const dist = faceapi.euclideanDistance(face.descriptor, desc);
        if (dist < THRESHOLD && dist < minDistance) {
          minDistance = dist;
          matchedCluster = cluster;
        }
      }
    }
    
    if (matchedCluster) {
      matchedCluster.descriptors.push(face.descriptor);
      matchedCluster.eventIds.add(face.eventId);
    } else {
      clusters.push({
        id: `person_${Math.random().toString(36).substr(2, 9)}`,
        name: 'Unknown Person',
        faceUrl: face.faceUrl,
        descriptors: [face.descriptor],
        eventIds: new Set([face.eventId])
      });
    }
    
    if (onProgress) onProgress(50 + ((i / allFaces.length) * 50));
  }
  
  // Filter out clusters with very few photos (e.g., less than 2) or convert sets to arrays
  return clusters
    .filter(c => c.eventIds.size >= 1) // keep all for now
    .map(c => ({
      id: c.id,
      name: c.name,
      faceUrl: c.faceUrl,
      eventIds: Array.from(c.eventIds)
    }))
    .sort((a, b) => b.eventIds.length - a.eventIds.length);
}
