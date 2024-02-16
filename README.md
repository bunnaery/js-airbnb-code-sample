# js-airbnb-code-sample
This coding sample is from a larger project for a React Native mobile chess app aimed at teaching beginners common chess openings. We also created a server with a custom chess engine to play against (in Python with Flask).

The coding sample for review is the `CodeSample.js` file. It is a single screen component I contributed where players can play a full chess game against a previously selected opening.

This code snippet:

* utilizes the `axios` library to handle `API requests` to the server
* uses `useState` for state management
* checks `native device height` to ensure screen is appropriately sized
* displays an info `button / pop-up modal` about the current chess opening and variation being played (updated via function check)

### Screenshots below:
<img src="/assets/Screenshot 2024-02-16 at 5.04.50 AM.png" alt="opening game screenshot" height="500">  <img src="/assets/Screenshot 2024-02-16 at 5.05.29 AM.png" alt="info modal open screenshot" height="500">
