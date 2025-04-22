const demoService = {
   async getConfig () {
      return { cpu: 0.8 };
   },
   logMessage: (msg: string) => {
      console.log("🪵 Log:", msg);
   },
};

export default demoService;
