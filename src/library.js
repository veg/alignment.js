import Alignment from "./Alignment.jsx";
import BAMViewer from "./app/BAM.jsx";
import BaseAlignment from "./components/BaseAlignment.jsx";
import BaseSVGAlignment from "./components/BaseSVGAlignment.jsx";
import SiteAxis from "./components/SiteAxis.jsx";
import SitePlotAxis from "./components/SitePlotAxis.jsx";
import SequenceAxis from "./components/SequenceAxis.jsx";
import fastaParser from "./helpers/fasta";
import computeLabelWidth from "./helpers/computeLabelWidth";
import ScrollBroadcaster from "./helpers/ScrollBroadcaster";
import * as colors from "./helpers/colors";

require("./app/styles.scss");

export default Alignment;
export {
  BAMViewer,
  BaseAlignment,
  BaseSVGAlignment,
  SiteAxis,
  SitePlotAxis,
  SequenceAxis,
  fastaParser,
  computeLabelWidth,
  ScrollBroadcaster,
  colors
};
