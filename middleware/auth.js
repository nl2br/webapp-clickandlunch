/**
 * Redirect user to login page if no token
 * @param {*} param0
 */
export default function({ store, redirect, route }) {
  const token = !!store.state.auth.token
  if (!token) {
    if (route.path !== '/login') return redirect('/login')
  }
}
