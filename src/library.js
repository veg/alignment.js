import Alignment from "./components/Alignment.jsx";
import BaseAlignment from "./components/BaseAlignment.jsx";
import Axis from "./components/SiteAxis.jsx";
import Labels from "./components/SequenceAxis.jsx";
import fastaParser from "./helpers/fasta";
import ScrollBroadcaster from "./helpers/ScrollBroadcaster";

require("./app.scss");

module.exports = Alignment;
module.exports.Alignment = Alignment;
module.exports.BaseAlignment = BaseAlignment;
module.exports.SiteAxis = SiteAxis;
module.exports.SequenceAxis = SequenceAxis;
module.exports.fastaParser = fastaParser;
module.exports.ScrollBroadcaster = ScrollBroadcaster;
