import main from './main';
import tunings from './tunings';
import keys from './keys';
import suffixes from './suffixes';
import chords from './chords';
import Instrument from '../instrument';

const guitar: Instrument = {
  main,
  tunings,
  keys,
  suffixes,
  chords
};

export default guitar;