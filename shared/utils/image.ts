const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://psychology-eosin.vercel.app/api"

export const getImageUrl = ( image: any ) => {
   if ( !image ) return null

   // If image is just a string (URL)
   if ( typeof image === 'string' ) {
      if ( image.startsWith( 'http' ) ) return image

      // Handle /api/media/file/... format returned by Payload
      // We need to extract the part after /api or just prepend the host
      const host = BASE_URL.replace( '/api', '' )
      return `${host}${image}`
   }

   // If image is a Payload Media object
   if ( typeof image === 'object' ) {
      const url = image.url
      if ( url ) {
         if ( url.startsWith( 'http' ) ) return url

         const host = BASE_URL.replace( '/api', '' )
         // Important: if URL already starts with /api, we don't need to add it again
         // just prepend the protocol+domain
         return `${host}${url}`
      }
   }

   return null
}
