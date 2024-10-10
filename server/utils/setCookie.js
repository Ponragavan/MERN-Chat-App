exports.setCookie = (res, token) => {
    res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  };