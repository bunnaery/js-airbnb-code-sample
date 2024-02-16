import * as React from 'react';
import { useState, useEffect } from 'react';
import { useWindowDimensions, Image } from 'react-native';
import axios from 'axios';
import Chessboard from 'react-native-chessboard';
import {
  GestureHandlerRootView, 
  gestureHandlerRootHOC
} from 'react-native-gesture-handler';
import { 
  Center, 
  Box, 
  Button, 
  Flex, 
  Heading, 
  useTheme, 
  AlertDialog, 
  Text, 
  Modal 
} from 'native-base';
import data from '../openingDescriptions.json';


const Opening = ({ route, navigation }) => {
  const { colors } = useTheme();
  const black = colors['pink'][200]
  const white = colors['pink'][50]
  const {height, width} = useWindowDimensions();
  const API = 'https://barbie-fischer-chess.onrender.com/games'

  /* Fen is a string notation that can be used to represent a chessboard
  at any given time during a game, including whose turn is next. We pass
  this back and forth to the server to play moves */
  const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const [currentFen, updateFen] = useState(initialFen); 
  const [oldFen, setOldFen] = useState();

  const [gameID, updateGameID] = useState();
  const [variation, setVariation] = useState('');
  const [moveList, updateMoveList] = useState([]);
  const [currentMove, setCurrentMove] = useState();

  /* On the previous screen, the player chose the opening they wanted
  to practice and which color they'd like to play */
  const opening = route.params.opening;
  const whitePlayer = route.params.color === 'white' ? 'player' : 'engine'; 
  const blackPlayer = route.params.color === 'black' ? 'player' : 'engine';

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [showModal, setShowModal] = useState(false);

  /* We create a new game by sending a POST request to our server (and database).
  The chess engine stores the params, and if the engine is whitePlayer, it
  sends back its first move immediately in the API response. */
  useEffect(() => {
    axios.post(`${API}`, {"white": whitePlayer, "opening": opening,})
    .then((result) => {
      console.log("Creating game...")
      updateGameID(result.data.game_id);
      updateFen(result.data.fen);
      setOldFen(result.data.fen);
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  /* This checks to see if our opening variation changed. If so, the information
  at the top of the screen will pull updated text from the json file. */
  const checkVariation = (info) => {
    if (info !== variation) {
      setVariation(info);
    }
  };

  /* The user must confirm their move before it sends a PATCH request. This is
  so that they have a chance to undo their move if they've misclicked. */
  const confirmMove = () => {
    let newMoveList = moveList;
    newMoveList.push(currentMove);
    updateMoveList(newMoveList);
    console.log({"fen": currentFen, "user_move_list": moveList});
      axios.patch(`${API}/${gameID}`, 
      {"fen": currentFen, "user_move_list": moveList, "white": whitePlayer})
      .then((result) => {
        console.log("Updating game...");
        updateFen(result.data.game.fen);
        setOldFen(result.data.game.fen);
        checkVariation(result.data.game.opening_variation);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const undoMove = () => {
    updateFen(oldFen);
  };
  
  const deleteGame = () => {
    axios.delete(`${API}/${gameID}`)
    .then((result) => {
      console.log("Deleting game..."); 
      console.log(result.data);
    })
    .catch((err) => {
      console.log(err); 
    })
    // A user is navigated back to the home screen immediately upon deletion.
    navigation.navigate('Home'); 
    
  }

  const ChessBoardRender = gestureHandlerRootHOC(() => (
      <Chessboard
        colors={ {black: black, white: white} }
        fen={ currentFen } 
        onMove={({ state }) => {
          updateFen(state.fen);
          setCurrentMove(state.history[0]);
        } }
      />
    )
  );

  return (
    <GestureHandlerRootView>
      <Center>
        <Flex direction="column" align="center" justify="space-evenly" 
        h="95%" w="100%">
          <Box w="100%">
            <Button _text={{textAlign: 'center'}} variant={'ghost'} 
            size={'sm'} w={'100%'} onPress={() => setShowModal(true)}>
              {`Playing ${opening} ${variation} (Click for info)`}
            </Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>
                  <Heading size={"md"}>{opening} {variation}</Heading>
                </Modal.Header>
                <Modal.Body>
                  <Text>
                    {variation 
                    ? data[opening]["Variations"][variation] 
                    : data[opening]["Summary"]}
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="unstyled" 
                  onPress={() => {setShowModal(false);}}>
                    GO BACK
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
            <Box style={{backgroundColor:"#F3BAD5", 
            paddingTop:6, paddingBottom:6, borderRadius: 4}}>
              <Box m={2} w="100%" _text={{textTransform: 'capitalize', 
              fontSize: 'md', fontWeight: 'bold'}}>
                {blackPlayer}
              </Box>
              <Box w={Math.floor(width / 8) * 8} h={Math.floor(width / 8) * 8}>
                <ChessBoardRender/>
              </Box>
              <Box marginY={2} marginX={-2} w="100%" 
              _text={{textTransform: 'capitalize', 
              textAlign: 'right', fontSize: 'md', 
              fontWeight: 'bold'}}>
                {whitePlayer}
              </Box>
            </Box>
          </Box>
          <Button.Group space={4} mt={4}>
            <Button variant={'outline'} onPress={undoMove}>
              Undo
            </Button>
            <Button variant={'subtle'} onPress={confirmMove}>
              Confirm
            </Button>
            <Button colorScheme={'muted'} onPress={() => setIsOpen(!isOpen)}>
              Resign
            </Button>
          </Button.Group>
          <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            <Heading>Delete Game {gameID}</Heading>
            </AlertDialog.Header>
          <AlertDialog.Body>
            <Text fontSize={'md'}> This will remove all data relating to 
            this game. This action cannot be reversed. Deleted data can 
            not be recovered.</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose}>
              Cancel
            </Button>
            <Button colorScheme="danger" onPress={deleteGame}>
              Delete
            </Button>
            </Button.Group>
          </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        </Flex>
      </Center>
    </GestureHandlerRootView>
  )
}

export default Opening;
