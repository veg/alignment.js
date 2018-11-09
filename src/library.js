import Alignment from "./components/Alignment.jsx";
import BaseAlignment from "./components/BaseAlignment.jsx";
import BaseTree from "./components/BaseTree.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import SequenceAxis from "./components/SequenceAxis.jsx";
import fastaParser from "./helpers/fasta";
import computeLabelWidth from "./helpers/computeLabelWidth";
import sortFASTAAndNewick from "./helpers/jointSort";
import ScrollBroadcaster from "./helpers/ScrollBroadcaster";
import colors from "./helpers/colors";

require("./app.scss");

module.exports = Alignment;
module.exports.Alignment = Alignment;
module.exports.BaseAlignment = BaseAlignment;
module.exports.BaseTree = BaseTree;
module.exports.SiteAxis = SiteAxis;
module.exports.SequenceAxis = SequenceAxis;
module.exports.fastaParser = fastaParser;
module.exports.computeLabelWidth = computeLabelWidth;
module.exports.sortFASTAAndNewick = sortFASTAAndNewick;
module.exports.ScrollBroadcaster = ScrollBroadcaster;
module.exports.colors = colors;
