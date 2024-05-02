import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

export default function PhotoGallery({ photos }: { photos: any[] }) {
  return (
    <div>
      <Gallery>
        <div>
          {photos &&
            photos.map((photo, i) => {
              return (
                <Item key={i} original={photo} width="960" height="1280">
                  {({ ref, open }) => (
                    <img ref={ref} src={photo} onClick={open} />
                  )}
                </Item>
              );
            })}
        </div>
      </Gallery>
    </div>
  );
}
