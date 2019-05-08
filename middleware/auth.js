/**
 * Redirect user to login page if no token
 * @param {*} param0
 */
export default function({ store, redirect, route }) {
  const token = !!store.state.auth.token
  console.log('TCL: middleware', token)
  if (!token) {
    if (route.path !== '/login' && route.path !== '/register')
      return redirect('/login')
  }
}
