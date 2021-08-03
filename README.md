# react-native-double-slider

A slider that supports two-way sliding

![screenshots](https://github.com/redye/react-native-double-slider/blob/master/screenshots/1.png)

## Installation

```sh
npm install react-native-double-slider --save
```

## Usage

```js
import * as React from 'react';
import { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DoubleSlider from 'react-native-double-slider';

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      slider1: {},
      slider2: {},
    };
  }

  render() {
    const { slider1 } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text>Default slider</Text>
          <View style={styles.valueBox}>
            <Text>{slider.minValue || ''}</Text>
            <Text>{slider.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            thumbStyle={styles.shadowStyle}
            minValue={parseInt(slider.minValue, 10)}
            maxValue={parseInt(slider.maxValue, 10)}
            onValueChanged={(minValue, maxValue) => {
              this.setState({
                slider: {
                  minValue: Math.min(minValue, maxValue).toFixed(2),
                  maxValue: Math.max(minValue, maxValue).toFixed(2),
                },
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
  box: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  valueBox: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {},
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

```

## Props

| Prop | Type | Optional | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| minValue | number | true | 0 | 当前最小值 |
| maxValue | number | true | 1 | 当前最大值 |
| disabled | bool | true | false | 是否可滑动 |
| minimumValue | number | true | 0 | 可滑动的最小值 |
| maximumValue | number | true | 0 | 可滑动的最大值 |
| step | number | true | 0 | step |
| defaultTrackTintColor | string | true | `#EEEEEE` | 默认颜色 |
| highlightTrackTintColor | string | true | `#15A25F` | 高亮颜色 |
| thumbTintColor | string | true | #15A25F | 滑块颜色 |
| thumbTouchSize | object | true | `{width: 40, height: 40}` |  滑块大小  |
| onValueChanged | function | true | -  | 值发生改变时的回调 |
| onSlidingStart | function | true |  -  | 开始滑动时的回调 |
| onSlidingComplete | function | true | - | 滑动结束时的回调 |
| style | style | true | - | 样式 |
| trackStyle | style | true | - | 高亮部分的样式 |
| thumbStyle | style | true | - | 滑块的样式 |
| thumbImage | source | true | - | 滑块的图片 |
| animateTransitions | bool | true | false | 动画 |
| animationType | string | true | `timing` | 动画方式：`timing`、`spring` 中的一种 |
| animationConfig | object | true | - | 动画配置 |


## License

MIT
