export default [
  {
    url: "/api/auth/login",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          token: 'qaz123wsx456edc789'
        }
      };
    }
  }
];