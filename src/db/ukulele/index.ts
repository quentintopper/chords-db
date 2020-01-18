import main from './main';
import tunings from './tunings';
import keys from './keys';
import suffixes from './suffixes';
import chords from './chords';
import Instrument from '../instrument';

const ukulele: Instrument = {
  main,
  tunings,
  keys,
  suffixes,
  chords
};

export default ukulele;