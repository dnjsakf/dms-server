const sessionMiddleware = (req, res, next) => {
  let sessionUser = {
    userId: "Annoymous",
  }
  if ( req.session?.user ) {
    sessinoUser = req.session.user;
  }
  if( req.method !== "GET" && req.body ){
    req.body.onCreate = function(){
      const now = new Date();
      this.regUserId = sessionUser.userId;
      this.regDttm = now;
      this.updUserId = sessionUser.userId;
      this.updDttm = now;
    }
    req.body.onUpdate = function(){
      const now = new Date();
      this.updUserId = sessionUser.userId;
      this.updDttm = now;
    }
  }
  next();
};

export default sessionMiddleware;
