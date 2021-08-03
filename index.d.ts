declare module 'react-native-double-slider' {
  import { ComponentClass, PureComponent } from 'react';
  import {
    ImageSourcePropType,
    SpringAnimationConfig,
    StyleProp,
    TimingAnimationConfig,
    ViewStyle,
  } from 'react-native';

  interface DoubleSliderProps {
    /**
     * Initial min value of the slider.
     * The value should be between minimumValue and maximumValue.
     * Default value is 0
     */
    minValue?: number;

    /**
     * Initial min value of the slider.
     * The value should be between minimumValue and maximumValue.
     * Default value is 1
     */
    maxValue?: number;

    /**
     * If true the user wonet be able to move the slider.
     * Default value is false.
     */
    disabled?: boolean;

    /**
     * Initial minimum value of the slider.
     * Default value is 0.
     */
    minimumValue?: number;

    /**
     * Initial maximum value of the slider.
     * Default value is 1.
     */
    maximumValue?: number;

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step?: number;

    /**
     * The color used for the track to outside of the buttons.
     * Overrides the default blue gradient image.
     */
    defaultTrackTintColor?: string;

    /**
     * The color used for the track to between of the buttons.
     * Overrides the default blue gradient image.
     */
    highlightTrackTintColor?: string;

    /**
     * The color used for the thumb.
     */
    thumbTintColor?: string;

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize?: { width: number; height: number };

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChanged?: (minValue: number, maxValue: number) => void;

    /**
     * Callback called when the user starts changing the value (e.g. when the slider is pressed).
     */
    onSlidingStart?: (minValue: number, maxValue: number) => void;

    /**
     * Callback called when the user finishes changing the value (e.g. when the slider is released).
     */
    onSlidingComplete?: (minValue: number, maxValue: number) => void;

    /**
     * The style applied to the slider container.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The style applied to the track.
     */
    trackStyle?: StyleProp<ViewStyle>;

    /**
     * The style applied to the thumb.
     */
    thumbStyle?: StyleProp<ViewStyle>;

    /**
     * Sets an image for the thumb.
     */
    thumbImage?: ImageSourcePropType;

    /**
     * Set to true to animate values with default 'timing' animation type
     */
    animateTransitions?: boolean;

    /**
     * Custom Animation type. 'spring' or 'timing'.
     */
    animationType?: 'spring' | 'timing';

    /**
     * Used to configure the animation parameters.  These are the same parameters in the Animated library.
     */
    animationConfig?: SpringAnimationConfig | TimingAnimationConfig;
  }

  const DoubleSlider: ComponentClass<DoubleSliderProps>;

  export default DoubleSlider;
}
