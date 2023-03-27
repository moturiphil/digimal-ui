export default function authHeader() {
    let user = JSON.parse(sessionStorage.getItem('user'));
  
    if (user) {
      return { Accept:'application/json' ,Authorization: 'Bearer ' + user }; // for back-end 
    } else {
      return {};
    }
  }