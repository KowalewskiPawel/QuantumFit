export const extractFileId = (link: string) => {
    // Extract the path part of the URL after 'images%2F'
    const pathStartIndex = link.indexOf("images%2F") + "images%2F".length;
    const pathEndIndex = link.indexOf("?");
  
    if (pathStartIndex !== -1 && pathEndIndex !== -1) {
      const encodedPath = link.substring(pathStartIndex, pathEndIndex);
      // Decode the '%2F' to '/'
      const decodedPath = decodeURIComponent(encodedPath);
  
      return decodedPath;
    } else {
      return null; // Return null if the link format is not as expected
    }
  };