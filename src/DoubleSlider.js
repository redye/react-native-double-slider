import React, { PureComponent } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  PanResponder,
  Easing,
  ViewPropTypes,
  I18nManager,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

const TRACK_SIZE = 2;
const THUMB_SIZE = 20;

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.containsPoint = function (x, y) {
  return (
    x >= this.x &&
    y >= this.y &&
    x <= this.x + this.width &&
    y <= this.y + this.height
  );
};

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100,
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0,
  },
};

export default class DoubleSlider extends PureComponent {
  static propTypes = {
    /**
     * Initial min value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    minValue: PropTypes.number,

    /**
     * Initial max value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 1.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    maxValue: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * The color used for the track to outside of the buttons.
     * Overrides the default blue gradient image.
     */
    defaultTrackTintColor: PropTypes.string,

    /**
     * The color used for the track track to between of the buttons.
     * Overrides the default blue gradient image.
     */
    highlightTrackTintColor: PropTypes.string,

    /**
     * The color used for the thumb.
     */
    thumbTintColor: PropTypes.string,

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChanged: PropTypes.func,

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: ViewPropTypes.style,

    /**
     * The style applied to the track.
     */
    trackStyle: ViewPropTypes.style,

    /**
     * The style applied to the thumb.
     */
    thumbStyle: ViewPropTypes.style,

    /**
     * Sets an image for the thumb.
     */
    thumbImage: Image.propTypes.source,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     */
    debugTouchArea: PropTypes.bool,

    /**
     * Set to true to animate values with default 'timing' animation type
     */
    animateTransitions: PropTypes.bool,

    /**
     * Custom Animation type. 'spring' or 'timing'.
     */
    animationType: PropTypes.oneOf(['spring', 'timing']),

    /**
     * Used to configure the animation parameters.  These are the same parameters in the Animated library.
     */
    animationConfig: PropTypes.object,
  };

  static defaultProps = {
    minValue: 0,
    maxValue: 1,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    defaultTrackTintColor: '#EEEEEE',
    highlightTrackTintColor: '#15A25F',
    thumbTintColor: '#ffffff',
    thumbTouchSize: { width: 40, height: 40 },
    debugTouchArea: false,
    animationType: 'timing',
  };

  _panLeft = false;
  _panRight = false;

  state = {
    containerSize: { width: 0, height: 0 },
    trackSize: { width: 0, height: 0 },
    thumbSize: { width: 0, height: 0 },
    allMeasured: false,
    leftValue: new Animated.Value(this.props.minValue),
    rightValue: new Animated.Value(this.props.maxValue),
    highlightLeftValue: new Animated.Value(this.props.minValue),
    highlightRightValue: new Animated.Value(this.props.maxValue),
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  componentWillReceiveProps(nextProps) {
    const newMinValue = nextProps.minValue;
    const newMaxValue = nextProps.maxValue;

    if (this.props.minValue !== newMinValue) {
      if (this.props.animateTransitions) {
        this._setCurrentLeftValueAnimated(newMinValue);
      } else {
        this._setLeftCurrentValue(newMinValue);
      }
    }
    if (this.props.maxValue !== newMaxValue) {
      if (this.props.animateTransitions) {
        this._setCurrentRightValueAnimated(newMaxValue);
      } else {
        this._setCurrentRightValue(newMaxValue);
      }
    }
  }

  _getPropsForComponentUpdate(props) {
    const {
      value,
      onValueChanged,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      ...otherProps
    } = props;

    return otherProps;
  }

  _handleStartShouldSetPanResponder = (
    e: Object /* gestureState: Object */
  ): boolean => {
    // Should we become active when the user presses down on the thumb?
    return this._thumbHitTest(e);
  };

  _handleMoveShouldSetPanResponder(/* e: Object, gestureState: Object */) {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  }

  _handlePanResponderGrant = (/* e: Object, gestureState: Object */) => {
    if (this._panLeft) {
      this._previousLeft = this._getThumbLeft(this._getLeftCurrentValue());
    } else {
      this._previousRight = this._getThumbRight(this._getRightCurrentValue());
    }

    this._fireChangeEvent('onSlidingStart');
  };

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }
    if (this._panLeft) {
      this._setLeftCurrentValue(this._getLeftValue(gestureState));
    } else if (this._panRight) {
      this._setCurrentRightValue(this._getRightValue(gestureState));
    }

    this._fireChangeEvent('onValueChanged');
  };

  _handlePanResponderRequestEnd(e: Object, gestureState: Object) {
    // Should we allow another component to take over this pan?
    return false;
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }
    if (this._panLeft) {
      this._setLeftCurrentValue(this._getLeftValue(gestureState));
    } else if (this._panRight) {
      this._setCurrentRightValue(this._getRightValue(gestureState));
    }

    this._fireChangeEvent('onSlidingComplete');
  };

  _measureContainer = (x) => {
    this._handleMeasure('containerSize', x);
  };

  _measureTrack = (x: Object) => {
    this._handleMeasure('trackSize', x);
  };

  _measureLeftThumb = (x: Object) => {
    this._handleMeasure('leftThumbSize', x);
  };

  _measureRightThumb = (x: Object) => {
    this._handleMeasure('rightThumbSize', x);
  };

  _handleMeasure = (name: string, x: Object) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };

    const storeName = `_${name}`;
    const currentSize = this[storeName];
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return;
    }
    this[storeName] = size;

    if (
      this._containerSize &&
      this._trackSize &&
      this._leftThumbSize &&
      this._rightThumbSize
    ) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._leftThumbSize,
        allMeasured: true,
      });
    }
  };

  _getRatio = (value: number) => {
    return (
      (value - this.props.minimumValue) /
      (this.props.maximumValue - this.props.minimumValue)
    );
  };

  _getThumbLeft = (value: number) => {
    const nonRtlRatio = this._getRatio(value);
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    );
  };

  _getThumbRight = (value: number) => {
    const nonRtlRatio = this._getRatio(value);
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    );
  };

  _getLeftValue = (gestureState: Object) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbLeft = this._previousLeft + gestureState.dx;

    const nonRtlRatio = thumbLeft / length;
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (this.props.step) {
      return Math.max(
        this.props.minimumValue,
        Math.min(
          this.props.maximumValue,
          this.props.minimumValue +
            Math.round(
              (ratio * (this.props.maximumValue - this.props.minimumValue)) /
                this.props.step
            ) *
              this.props.step
        )
      );
    }
    return Math.max(
      this.props.minimumValue,
      Math.min(
        this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) +
          this.props.minimumValue
      )
    );
  };

  _getRightValue = (gestureState: Object) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbRight = this._previousRight + gestureState.dx;

    const nonRtlRatio = thumbRight / length;
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (this.props.step) {
      return Math.max(
        this.props.minimumValue,
        Math.min(
          this.props.maximumValue,
          this.props.minimumValue +
            Math.round(
              (ratio * (this.props.maximumValue - this.props.minimumValue)) /
                this.props.step
            ) *
              this.props.step
        )
      );
    }
    return Math.max(
      this.props.minimumValue,
      Math.min(
        this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) +
          this.props.minimumValue
      )
    );
  };

  _getLeftCurrentValue = () => this.state.leftValue.__getValue();

  _getRightCurrentValue = () => this.state.rightValue.__getValue();

  _setLeftCurrentValue = (value: number) => {
    this.state.leftValue.setValue(value);
    this._setCurrentHighlightValue();
  };

  _setCurrentRightValue = (value: number) => {
    this.state.rightValue.setValue(value);
    this._setCurrentHighlightValue();
  };

  _setCurrentHighlightValue = () => {
    const leftValue = this._getLeftCurrentValue();
    const rightValue = this._getRightCurrentValue();
    this.state.highlightLeftValue.setValue(Math.min(leftValue, rightValue));
    this.state.highlightRightValue.setValue(Math.max(leftValue, rightValue));
  };

  _setCurrentLeftValueAnimated = (value: number) => {
    const animationType = this.props.animationType;
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {
        toValue: value,
      }
    );

    Animated[animationType](this.state.leftValue, animationConfig).start();
    Animated[animationType](
      this.state.highlightLeftValue,
      animationConfig
    ).start();
  };

  _setCurrentRightValueAnimated = (value: number) => {
    const animationType = this.props.animationType;
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {
        toValue: value,
      }
    );

    Animated[animationType](this.state.rightValue, animationConfig).start();
    Animated[animationType](
      this.state.highlightRightValue,
      animationConfig
    ).start();
  };

  _fireChangeEvent = (event) => {
    if (this.props[event]) {
      this.props[event](
        this._getLeftCurrentValue(),
        this._getRightCurrentValue()
      );
    }
  };

  _getTouchOverflowSize = () => {
    const state = this.state;
    const props = this.props;

    const size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(
        0,
        props.thumbTouchSize.width - state.thumbSize.width
      );
      size.height = Math.max(
        0,
        props.thumbTouchSize.height - state.containerSize.height
      );
    }

    return size;
  };

  _getTouchOverflowStyle = () => {
    const { width, height } = this._getTouchOverflowSize();

    const touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  _thumbHitTest = (e: Object) => {
    const nativeEvent = e.nativeEvent;
    const leftThumbTouchRect = this._getLeftThumbTouchRect();
    const rightThumbTouchRect = this._getRightThumbTouchRect();
    const inLeft = leftThumbTouchRect.containsPoint(
      nativeEvent.locationX,
      nativeEvent.locationY
    );
    const inRight = rightThumbTouchRect.containsPoint(
      nativeEvent.locationX,
      nativeEvent.locationY
    );
    this._panLeft = inLeft;
    this._panRight = inRight;
    return inLeft || inRight;
  };

  _getLeftThumbTouchRect = () => {
    const state = this.state;
    const props = this.props;
    const touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 +
        this._getThumbLeft(this._getLeftCurrentValue()) +
        (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 +
        (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  };

  _getRightThumbTouchRect = () => {
    const state = this.state;
    const props = this.props;
    const touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 +
        this._getThumbRight(this._getRightCurrentValue()) +
        (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 +
        (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  };

  _renderDebugThumbTouchRect = (thumbLeft) => {
    const thumbTouchRect = this._getLeftThumbTouchRect();
    const positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height,
    };

    return (
      <Animated.View
        style={[
          defaultStyles.debugThumbTouchArea,
          positionStyle,
          // eslint-disable-next-line react-native/no-inline-styles
          { backgroundColor: '#f00' },
        ]}
        pointerEvents="none"
      />
    );
  };

  _renderThumbImage = (thumbStyle) => {
    const { thumbImage } = this.props;

    if (!thumbImage) return;

    return <Image style={thumbStyle} source={thumbImage} />;
  };

  render() {
    const {
      minimumValue,
      maximumValue,
      defaultTrackTintColor,
      highlightTrackTintColor,
      thumbTintColor,
      thumbImage,
      styles,
      style,
      trackStyle,
      thumbStyle,
      debugTouchArea,
      onValueChanged,
      thumbTouchSize,
      animationType,
      animateTransitions,
      ...other
    } = this.props;
    const {
      leftValue,
      rightValue,
      highlightLeftValue,
      highlightRightValue,
      containerSize,
      thumbSize,
      allMeasured,
    } = this.state;
    const mainStyles = styles || defaultStyles;
    const thumbLeft = leftValue.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: I18nManager.isRTL
        ? [0, -(containerSize.width - thumbSize.width)]
        : [0, containerSize.width - thumbSize.width],
    });
    const thumbRight = rightValue.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: I18nManager.isRTL
        ? [0, -(containerSize.width - thumbSize.width)]
        : [0, containerSize.width - thumbSize.width],
    });
    const leftMinimumTrackWidth = highlightLeftValue.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
    });

    const rightMinimumTrackWidth = highlightRightValue.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [containerSize.width - thumbSize.width, 0],
    });
    const valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }
    const highlightTrackStyle = {
      position: 'absolute',
      left: Animated.add(leftMinimumTrackWidth, thumbSize.width / 2),
      right: Animated.add(rightMinimumTrackWidth, thumbSize.width / 2),
      backgroundColor: highlightTrackTintColor,
      ...valueVisibleStyle,
    };

    const touchOverflowStyle = this._getTouchOverflowStyle();

    return (
      <View
        {...other}
        style={[mainStyles.container, style]}
        onLayout={this._measureContainer}
      >
        <View
          style={[
            { backgroundColor: defaultTrackTintColor },
            mainStyles.track,
            trackStyle,
          ]}
          renderToHardwareTextureAndroid
          onLayout={this._measureTrack}
        />
        <Animated.View
          renderToHardwareTextureAndroid
          style={[mainStyles.track, trackStyle, highlightTrackStyle]}
        />
        <Animated.View
          onLayout={this._measureLeftThumb}
          renderToHardwareTextureAndroid
          style={[
            { backgroundColor: thumbTintColor },
            mainStyles.thumb,
            thumbStyle,
            {
              transform: [{ translateX: thumbLeft }, { translateY: 0 }],
              ...valueVisibleStyle,
            },
          ]}
        >
          {this._renderThumbImage({ ...mainStyles.thumb, ...thumbStyle })}
        </Animated.View>
        <Animated.View
          onLayout={this._measureRightThumb}
          renderToHardwareTextureAndroid
          style={[
            { backgroundColor: thumbTintColor },
            mainStyles.thumb,
            thumbStyle,
            {
              transform: [{ translateX: thumbRight }, { translateY: 0 }],
              ...valueVisibleStyle,
            },
          ]}
        >
          {this._renderThumbImage({ ...mainStyles.thumb, ...thumbStyle })}
        </Animated.View>
        <View
          renderToHardwareTextureAndroid
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }
}

const defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  },
});
