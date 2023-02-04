export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));

    
    console.log(user);
  
    if (user) {
      return { Accept:'application/json' ,Authorization: 'Bearer ' + user }; // for back-end 
    } else {
      return {};
    }
  }