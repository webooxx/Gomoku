
import oGomoku from "./lib/Gomoku";

window.oDOM = new oGomoku({id: 'appDom', renderType: 'dom'});
window.oCanvas = new oGomoku({id: 'appCanvas', renderType: 'canvas'});


oDOM.restart(false);
oCanvas.restart(false);

[["2_4", "black"], ["2_5", "white"], ["2_6", "black"], ["2_7", "white"], ["2_8", "black"], ["2_9", "white"], ["2_10", "black"], ["2_11", "white"], ["3_11", "black"], ["4_11", "white"], ["5_11", "black"], ["6_11", "white"], ["7_11", "black"], ["8_11", "white"], ["9_11", "black"], ["10_11", "white"], ["11_11", "black"], ["12_11", "white"], ["12_10", "black"], ["12_9", "white"], ["12_8", "black"], ["12_7", "white"], ["12_6", "black"], ["12_5", "white"], ["12_4", "black"], ["6_10", "white"], ["6_9", "black"], ["6_8", "white"], ["6_7", "black"], ["7_7", "white"], ["8_7", "black"], ["8_8", "white"], ["8_9", "black"], ["8_10", "white"], ["7_10", "black"], ["7_9", "white"], ["7_8", "black"], ["1_4", "white"], ["1_5", "black"], ["1_6", "white"], ["1_8", "black"], ["1_7", "white"], ["1_9", "black"], ["1_10", "white"], ["1_11", "black"], ["13_11", "white"], ["13_10", "black"], ["13_9", "white"], ["13_8", "black"], ["13_7", "white"], ["13_6", "black"], ["13_5", "white"], ["13_4", "black"]].forEach((i) => {
    oDOM.setIn(i[0]);
    oCanvas.setIn(i[0]);
});
