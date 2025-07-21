<h1 align="center">Lifetimed</h1>

<p align="center">
Lifetimed is a JavaScript/TypeScript library for simplifying the management of disposable resources
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/lifetimed">
    <img src="https://img.shields.io/npm/dm/lifetimed.svg" alt="downloads" height="18">
  </a>
  <a href="https://www.npmjs.com/package/lifetimed">
    <img src="https://img.shields.io/npm/v/lifetimed.svg" alt="npm version" height="18">
  </a>
  <a href="https://github.com/vanifatovvlad/lifetimed">
    <img src="https://img.shields.io/npm/l/lifetimed.svg" alt="MIT license" height="18">
  </a>
</p>

### Lifetimed :heart: Promises
```ts
async function loadUsers(parentLifetime: Lifetime): Promise<string> {
    // Сreate a temporary child lifetime for function
    const { lifetime, abort } = parentLifetime.scope()

    try {
        // Add listener to the cancel button.
        // No need to manually unsubscribe, it will done automatically
        lifetimedListenEvents(lifetime, cancelButton, 'click', () => {            
            // Early cancel the lifetime with all attached resources like web-request or setTimeouts
            abort()
        })

        // Make a request.
        // Request will be aborted if if takes more than a second.
        // Request will be aborted also if parent lifetime will be aborted.
        const response = await lifetimedFetch(lifetime.timeout(1000), '/users')
        const data = await response.json()
        return data
    }
    finally {
        // Clear resources attached to the lifetime
        abort()
    }
}
```

### Lifetimed :heart: React
```ts
// useLifetimedEffect will recreate the lifetime when deps are changes 
// and abort it when the component is unmounted.
// Automatically.
useLifetimedEffect(async lifetime => {
    const response = await lifetimedFetch(lifetime, `avatars/${user}`)
    const data = await response.text()
    setUserAvatarUrl(data)
}, [user])
```
### Lifetimed :heart: Rx
```ts
const observable = Rx.Observable.interval(1000);
// with lifetimes you will never forget to unsubscribe from observable
observable.lifetimedSubscribe(lifetime, x => console.log(x));
```
