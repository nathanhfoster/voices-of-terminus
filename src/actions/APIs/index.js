import MomentJS from "moment";

const shouldUpdate = lastApiCall => {
  if (!lastApiCall) {
    // console.log("!lastApiCall: ", !lastApiCall);
    // console.log("lastApiCall: ", lastApiCall);
    return true;
  }
  const shouldUpdate = MomentJS().diff(MomentJS(lastApiCall), "hours") > 12;
  // console.log(lastApiCall);
  // console.log(shouldUpdate);
  return shouldUpdate;
};

export { shouldUpdate };
