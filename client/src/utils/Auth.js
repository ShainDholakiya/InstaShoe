import auth0 from 'auth0-js';

class Auth {
  constructor() {
    let redirectUri = 'https://peaceful-shelf-92187.herokuapp.com/callback';
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      redirectUri = 'http://localhost:3000/callback';
    }
    this.auth0 = new auth0.WebAuth({
      domain: 'stimpacc.auth0.com',
      audience: 'https://stimpacc.auth0.com/userinfo',
      clientID: 'ZLCb2Ey0aLiRpsEvdMKs08bAgaiOrCGo',
      redirectUri: redirectUri,
      responseType: 'id_token',
      scope: 'openid profile'
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: 'ZLCb2Ey0aLiRpsEvdMKs08bAgaiOrCGo',
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
