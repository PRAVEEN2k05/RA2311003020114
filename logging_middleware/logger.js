const Log = async (service, level, module, message) => {
  console.log(`[${level.toUpperCase()}] [${service}] [${module}] ${message}`);
};

module.exports = Log;