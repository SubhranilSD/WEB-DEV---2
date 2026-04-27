# note 
1.to run react app : npm run dev

# hooks
1. Hooks are functions
2. Hooks allow to use State and other features without writing a class

# rules to use hooks
1. Only call hooks at the top level
2. Only call hooks from React functions

## UseEffect hook
1. After the page render for the first time the useeffect hook will work atleast once.
 Syntax:

 ```javascript
 useEffect(() => {
     //mounting
      first
    
      return () => {
        //unmounting
        second
      }
    }, [Updating]) ```
a
