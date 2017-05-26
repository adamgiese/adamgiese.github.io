'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var notes = {
  C: 523.25,
  Cs: 554.37,
  Db: 554.37,
  D: 587.33,
  Ds: 622.25,
  Eb: 622.25,
  E: 659.25,
  F: 698.46,
  Fs: 739.99,
  Gb: 739.99,
  G: 783.99,
  Gs: 830.61,
  Ab: 830.61,
  A: 880.00,
  As: 932.33,
  Bb: 932.33,
  B: 987.77
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement(Beats, null)
    );
  };

  return App;
}(React.Component);

var Beats = function (_React$Component2) {
  _inherits(Beats, _React$Component2);

  function Beats() {
    _classCallCheck(this, Beats);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));

    var durations = Array(16).fill(300);
    var frequencies = [notes.C, notes.D, notes.Eb, notes.G, notes.Ab, notes.B, notes.C * 2];
    var map = Array(durations.length).fill(null);
    for (var i in map) {
      map[i] = Array(frequencies.length).fill(false);
    }

    _this2.state = {
      current: 0,
      frequencies: frequencies,
      durations: durations,
      map: map
    };

    return _this2;
  }

  Beats.prototype.handleTileClick = function handleTileClick(beatIndex, tileIndex) {
    var newMap = this.state.map.slice();
    newMap[beatIndex][tileIndex] = !newMap[beatIndex][tileIndex];
    this.setState({
      map: newMap
    });
  };

  Beats.prototype.componentDidMount = function componentDidMount() {
    var _this3 = this;

    var iterate = function iterate() {
      var newCurrent = _this3.state.current + 1 >= _this3.state.durations.length ? 0 : _this3.state.current + 1;
      _this3.setState({
        'current': newCurrent
      });
      var duration = _this3.state.durations[newCurrent];
      setTimeout(iterate, duration);
    };
    iterate();
  };

  Beats.prototype.render = function render() {
    var _this4 = this;

    var beats = [];
    for (var i = 0; i < this.state.durations.length; i++) {

      var isCurrent = this.state.current === i;
      beats.push(React.createElement(Beat, {
        beatIndex: i,
        activeTiles: this.state.map[i],
        isCurrent: isCurrent,
        duration: this.state.durations[i],
        frequencies: this.state.frequencies,
        onClick: function onClick(beatIndex, tileIndex) {
          return _this4.handleTileClick(beatIndex, tileIndex);
        }
      }));
    }
    return React.createElement(
      'div',
      { className: 'beats' },
      beats
    );
  };

  return Beats;
}(React.Component);

var Beat = function (_React$Component3) {
  _inherits(Beat, _React$Component3);

  function Beat() {
    _classCallCheck(this, Beat);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  Beat.prototype.render = function render() {
    var _this6 = this;

    var tiles = [];

    for (var i = 0; i < this.props.frequencies.length; i++) {

      tiles.push(React.createElement(Tile, {
        tileIndex: i,
        isActive: this.props.activeTiles[i],
        isCurrent: this.props.isCurrent,
        beatIndex: this.props.beatIndex,
        frequency: this.props.frequencies[i],
        duration: this.props.duration,

        onClick: function onClick(beatIndex, tileIndex) {
          return _this6.props.onClick(beatIndex, tileIndex);
        }
      }));
    }
    var activeState = this.props.isCurrent ? 'active' : 'inactive';
    return React.createElement(
      'div',
      { className: activeState + ' beat' },
      tiles,
      React.createElement('div', { className: 'beat-indicator' })
    );
  };

  return Beat;
}(React.Component);

var Tile = function (_React$Component4) {
  _inherits(Tile, _React$Component4);

  function Tile() {
    _classCallCheck(this, Tile);

    return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  Tile.prototype.render = function render() {
    var _this8 = this;

    if (this.props.isActive && this.props.isCurrent) {
      var note = new Sound(audioContext);
      var now = audioContext.currentTime;
      note.play(this.props.frequency, now, this.props.duration);
    }
    var activeState = this.props.isActive ? 'active' : 'inactive';
    return React.createElement('button', {
      className: 'tile ' + activeState,
      style: { fontSize: this.props.duration / 500 + 'em' },
      onClick: function onClick(beatIndex, tileIndex) {
        return _this8.props.onClick(_this8.props.beatIndex, _this8.props.tileIndex);
      }
    });
  };

  return Tile;
}(React.Component);

var Sound = function () {
  //from https://css-tricks.com/introduction-web-audio-api/#article-header-id-4

  function Sound(context) {
    _classCallCheck(this, Sound);

    this.context = context;
  }

  Sound.prototype.init = function init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = 'sine';
  };

  Sound.prototype.play = function play(value, time) {
    var duration = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    this.init();

    this.oscillator.frequency.value = value;
    this.gainNode.gain.setValueAtTime(1, this.context.currentTime);

    this.oscillator.start(time);
    this.stop(time, duration);
  };

  Sound.prototype.stop = function stop(time, duration) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration / 1000);
    this.oscillator.stop(time + duration / 1000);
  };

  return Sound;
}();

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
