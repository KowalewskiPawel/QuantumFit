import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily: "Roboto-Black",
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    height: 50,
    borderRadius: 25,
    color: "#FFFFFF",
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
  },
  textBackground: {
    paddingVertical: 5, // Adjust the padding as needed
    paddingHorizontal: 10, // Adjust the padding as needed
    borderRadius: 10, // Gives rounded corners
    alignSelf: "center", // Centers the background on the text
    marginBottom: 5, // Space below the text
  },
  text: {
    color: "#FFFFFF", // White text
    fontWeight: "bold",
    fontFamily: "Roboto-Black",
  },
  title: {
    // color: "#FFFFFF", // White text color for contrast
    fontSize: 32, // Larger font size for prominence
    fontFamily: "Roboto-Black",
    textAlign: "center", // Center the text
    fontWeight: "900", // Extra bold font weight
    letterSpacing: 2, // Spacing out the letters for a more refined appearance
    textShadowOffset: { width: 2, height: 2 }, // Positioning of the text shadow
    textShadowRadius: 3, // Blurring the shadow for a softer look
    marginBottom: 10, // Space below the title
  },

  secondarySubtitleUppercase: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "400",
    textTransform: "uppercase",
  },
  bigUnits: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 2,
    alignSelf: 'flex-end'
  },
  surface: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginBottom: 20,
    borderColor: "#FFFFFF", // Border color for the image
    borderWidth: 2,
    borderRadius: 10, // Optional: if you want rounded corners
  },
  uploadingStatus: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  uploadSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  titleContainer: {
    justifyContent: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
  },
});
