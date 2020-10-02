/**
 * This file is to export code strictly for renderer scripts.
 */
import StatsModule from 'three/examples/jsm/libs/stats.module';

export { GUI } from 'three/examples/jsm/libs/dat.gui.module';

const Stats = (StatsModule as VoidFunction);
export {
    Stats
}