import Image from 'next/image'
import { FormEvent, useState } from "react";
import { BANDCAMP_IMAGE_HEIGHT, BANDCAMP_IMAGE_WIDTH, BANDCAMP_URL_REGEX } from "../consts";

export const Service = () => {
  const [url, setUrl] = useState<string>('')
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string | null>() 
  
  const submitBtn = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(url) {
      if(!BANDCAMP_URL_REGEX.test(url)) return
      setImageLoading(true)
      setImageUrl(
        url.replace(BANDCAMP_URL_REGEX, (_: any, item: string ) => `https://bandcamp2image.vercel.app/image/${item}#.png`)
      )
      console.log(url, imageUrl)
    }
  }
  const BandCampImageLinks = ({ url, imageUrl}) => {
    return (
      <>
        <div>
          <p>Image URL</p>
          <textarea 
            value={imageUrl}
          />
        </div>
      </>
    )
  }
  return (
    <>
      <form
        method="PUT"
        onSubmit={(e) => {
          submitBtn(e)
        }}
      >
        <input 
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://open.spotify.com/..."
        />
        <button
          type="submit"
        >
          generate URLs
        </button>
      </form>
      
      <div>
        {imageUrl 
          && (
            <div>
              {imageLoading && <div>Now Loading</div>}
              {imageUrl && (
                <Image 
                  src={imageUrl}
                  height={BANDCAMP_IMAGE_HEIGHT}
                  width={BANDCAMP_IMAGE_WIDTH}
                  quality={100}
                  onLoadingComplete={() => {
                    setImageLoading(false);
                  }}
                />
              )}
              <div>
                <BandCampImageLinks url={url} imageUrl={imageUrl} />    
              </div>
            </div>
          )
        }
      </div>
    </>
  )

}