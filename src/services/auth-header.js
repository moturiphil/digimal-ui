export default function authHeader() {
    let token = JSON.parse(sessionStorage.getItem('user'));
  
    if (token) {
      return { Accept:'application/json' ,Authorization: 'Bearer ' + token }; // for back-end 
    } else {
      return {};
    }
  }