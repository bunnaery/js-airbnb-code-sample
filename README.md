# js-airbnb-code-sample
This coding sample was pulled from my group capstone project called 'Barbie Fischer Chess App.' It was a mobile chess app aimed towards users who wanted to practice their chess openings and continue to play against a chess engine after leaving the opening game (which you cannot do on sites like Chess.com currently).

It was created using React Native on the frontend and Python (Flask) on the backend. This particular snippet is taken from the frontend.

While it was a group project, I have made sure this coding sample includes ONLY code written by me. I've also included some comments I hope will be helpful.

**Summary:** This code sample is the screen where a player practices a chess opening against our chess engine (located on a server). It makes regular `API requests`, updating state as needed based on responses. It also has a button and modal combo on `lines 127-150` that gives the player more information about the opening they're practicing. Because chess openings have variations that depend on both player's moves, it automatically pulls the correct content from a json file depending on the `variation` state variable.

### Screenshots below:
<img src="/assets/Screenshot 2024-02-16 at 5.04.50 AM.png" alt="opening game screenshot" height="500">  <img src="/assets/Screenshot 2024-02-16 at 5.05.29 AM.png" alt="info modal open screenshot" height="500">