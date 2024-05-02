import "../globals";
import Trumbowyg from "react-trumbowyg";

import "trumbowyg/dist/plugins/fontfamily/trumbowyg.fontfamily";
import "react-trumbowyg/dist/trumbowyg.min.css";
import "trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize";
import "trumbowyg/dist/plugins/colors/trumbowyg.colors";
import "trumbowyg/dist/plugins/indent/trumbowyg.indent";
import "trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css";

export default function TrumbowygEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: { target: { innerHTML: string } }) => void;
}) {
  function onFeildInit(event: any) {
    if (!event || !event.target) {
      return;
    }

    event.target.innerHTML = value;
  }
  const buttons = [
    ["viewHTML"],
    ["fontfamily"],
    ["fontsize"],
    ["foreColor", "backColor"],
    ["formatting"],
    ["link"],
    ["strong", "em", "del"],
    ["insertImage"],
    ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull"],
    ["unorderedList", "orderedList"],
    ["horizontalRule"],
    ["removeformat"],
    ["fullscreen"],
  ];
  return (
    <>
      <Trumbowyg
        id="react-trumbowyg"
        buttons={buttons}
        data={""}
        onInit={onFeildInit}
        resetCss={true}
        removeformatPasted={true}
        onChange={onChange}
        plugins={{
          fontsize: {
            allowCustomSize: false,
          },
        }}
      />
    </>
  );
}
