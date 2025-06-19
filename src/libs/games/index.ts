import lhcConfig from './config/lhc.ts';
import sscConfig from './config/ssc.ts';

const lhc: iGameData = {
  id: 21,
  title: "新澳门⑥合彩",
  config: lhcConfig,
  showSpecial: true,
  showText: true,
}
  
const ssc: iGameData = {
  id: 34,
  title: "分分时时彩",
  config: sscConfig,
  showSpecial: false,
  showText: false,
}

export { lhc, ssc }
