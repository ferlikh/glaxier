export const RESERVED_KEYWORDS = [
    '__scn__', 
    '_attached',
    'attach', 
    'attached',
    'camera',
    'container',
    'controls',
    'effects',
    'lights',
    'loop',
    'loops',
    'meshes',
    'objects',
    'options', 
    'props',
    'renderer',
    'scene', 
    'scenes',
    'setup', 
    'setups', 
].reduce((dict, propName) => {
    dict[propName] = true;
    return dict;
}, {});