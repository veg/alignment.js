import Alignment from "./alignment";
import BaseAlignment from "./basealignment";
import Axis from "./axis";
import Labels from "./labels";
import fastaParser from "./fasta";
import ScrollBroadcaster from "./scrollbroadcaster";

require("./app.scss");

module.exports = Alignment;
module.exports.Alignment = Alignment;
module.exports.BaseAlignment = BaseAlignment;
module.exports.Labels = Labels;
module.exports.Axis = Axis;
module.exports.fastaParser = fastaParser;
module.exports.ScrollBroadcaster = ScrollBroadcaster;
