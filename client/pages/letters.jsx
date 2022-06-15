import React from 'react';
import ShowLoader from '../components/loader';
import ShowError from '../components/error';

export default class Letters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      letters: [],
      words: [],
      playA: false,
      wordShowing: false,
      isLoading: true,
      error: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.nextLetter = this.nextLetter.bind(this);
    this.previousLetter = this.previousLetter.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await fetch('api/letters');
      const letters = await res.json();
      this.setState({ letters, isLoading: false });
      if (this.state.playA === false) {
        this.autoA = setTimeout(() => {
          this.setState({ playA: true });
          const audio = new Audio(this.state.letters[0].audioUrl); audio.play();
        }, 1300);
      }
    } catch (err) {
      console.error(err);
      this.setState({ error: true, isLoading: false });
    }
    try {
      const res2 = await fetch('api/words');
      const words = await res2.json();
      this.setState({ words, isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ error: true, isLoading: false });
    }
    window.addEventListener('keydown', this.handlePress);
  }

  componentWillUnmount() {
    clearTimeout(this.autoA);
    window.removeEventListener('keydown', this.handlePress);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentIndex !== prevState.currentIndex) {
      const audio = new Audio(this.state.letters[this.state.currentIndex].audioUrl); audio.play();
    }
  }

  handleClick(event, index) {
    if (event.target.className === 'fas fa-chevron-right') {
      this.nextLetter();
    } else if (event.target.className === 'fas fa-chevron-left') {
      this.previousLetter();
    }
    if (event.target.id === 'letter') {
      this.setState({ wordShowing: true });
      const audio = new Audio(this.state.words[this.state.currentIndex].audioUrl); audio.play();
    } else if (event.target.id === 'word') {
      this.setState({ wordShowing: false });
      const audio = new Audio(this.state.letters[this.state.currentIndex].audioUrl); audio.play();
    } else {
      this.setState({ wordShowing: false });
    }
  }

  handlePress() {
    const { wordShowing } = this.state;
    if (event.key === 'ArrowRight') {
      this.nextLetter();
      this.setState({ wordShowing: false });
    } else if (event.key === 'ArrowLeft') {
      this.previousLetter();
      this.setState({ wordShowing: false });
    }

    if (event.key === ' ') {
      this.setState({ wordShowing: !wordShowing });
      if (!wordShowing) {
        const audio = new Audio(this.state.words[this.state.currentIndex].audioUrl); audio.play();
      } else if (wordShowing) {
        const audio = new Audio(this.state.letters[this.state.currentIndex].audioUrl); audio.play();
      }
    }
  }

  nextLetter() {
    if (this.state.currentIndex >= this.state.letters.length - 1) {
      this.setState({
        currentIndex: 0
      });
    } else {
      this.setState({
        currentIndex: this.state.currentIndex + 1
      });
    }
  }

  previousLetter() {
    if (this.state.currentIndex <= 0) {
      this.setState({
        currentIndex: this.state.letters.length - 1
      });
    } else {
      this.setState({
        currentIndex: this.state.currentIndex - 1
      });
    }
  }

  render() {
    if (this.state.isLoading) return <ShowLoader />;
    if (this.state.error) return <ShowError />;
    if (this.state.letters.length === 0) return null;
    if (this.state.words.length === 0) return null;
    const { imageUrl } = this.state.letters[this.state.currentIndex];
    const wordImage = this.state.words[this.state.currentIndex].imageUrl;
    const word = this.state.words[this.state.currentIndex].word;
    let display;
    let showImageText;

    if (!this.state.wordShowing) {
      display = <img id='letter' src={imageUrl} onClick={this.handleClick}></img>;
      showImageText = <span className='word-text'></span>;
    } else if (this.state.wordShowing) {
      display = <img id='word' src={wordImage} onClick={this.handleClick}></img>;
      showImageText = <span className='word-text'>{word}</span>;
    }

    return (
      <div className="container">
        <div className="style">
          <div className="row">
            <div className="column-third">
              <i onClick={this.handleClick} className="fas fa-chevron-left"></i>
            </div>
            <div className="center-img">
              {display}
            </div>
            <div className="column-third">
              <i onClick={this.handleClick} className="fas fa-chevron-right"></i>
            </div>
          </div>
          <div className='col-full text-align'>
            {showImageText}
          </div>
        </div>
      </div>
    );
  }
}
