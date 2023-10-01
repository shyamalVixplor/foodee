import Snackbar from 'react-native-snackbar';
import constant from '../constant/constant';

var AlertService = {
  successAlert(msg = '') {
    setTimeout(() => {
      Snackbar.show({
        text: msg,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: constant.BgSuccess,
        action: {
          text: 'Okay',
        },
      });
    }, 50);
  },

  dangerAlert(msg = '') {
    setTimeout(() => {
      Snackbar.show({
        text: msg,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: constant.BgPrimary,
        action: {
          text: 'Okay',
        },
      });
    }, 50);
  },

  warningAlert(msg = '') {
    setTimeout(() => {
      Snackbar.show({
        text: msg,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: constant.BgWarning,
        action: {
          text: 'Okay',
        },
      });
    }, 50);
  },
};

export default AlertService;
