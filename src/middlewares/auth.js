const isLogin = async (req, res, next) => {
    try {
        if(!req.session.user) {
            res.redirect('/api/auth/login')
        }
        next();
    }
    catch(err) {
        next(err);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if(req.session.user) {
            res.redirect('/api/auth/dashboard')
        }
        next();
    }
    catch(err) {
        next(err);
    }
}

module.exports = {
    isLogin,
    isLogout,
}