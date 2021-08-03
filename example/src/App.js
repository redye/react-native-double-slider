import * as React from 'react';
import { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DoubleSlider from 'react-native-double-slider';

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      slider: {
        minValue: '0',
        maxValue: '1',
      },
      slider1: {
        minValue: '5',
        maxValue: '15',
      },
      slider2: {
        minValue: '10',
        maxValue: '40',
      },
      slider3: {
        minValue: '10',
        maxValue: '40',
      },
    };
  }

  render() {
    const { slider, slider1, slider2, slider3 } = this.state;
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
        <View style={styles.box}>
          <Text>Custom slider #1</Text>
          <View style={styles.valueBox}>
            <Text>{slider1.minValue || ''}</Text>
            <Text>{slider1.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            thumbStyle={styles.shadowStyle}
            minimumValue={0}
            maximumValue={30}
            minValue={parseInt(slider1.minValue, 10)}
            maxValue={parseInt(slider1.maxValue, 10)}
            thumbImage={require('./images/thumb.jpg')}
            highlightTrackTintColor="#00f"
            defaultTrackTintColor="#aaa"
            onValueChanged={(minValue, maxValue) => {
              this.setState({
                slider1: {
                  minValue: Math.min(minValue, maxValue).toFixed(2),
                  maxValue: Math.max(minValue, maxValue).toFixed(2),
                },
              });
            }}
          />
        </View>
        <View style={styles.box}>
          <Text>Custom slider #2</Text>
          <View style={styles.valueBox}>
            <Text>{slider2.minValue || ''}</Text>
            <Text>{slider2.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            thumbStyle={styles.shadowStyle}
            minimumValue={0}
            maximumValue={50}
            minValue={parseInt(slider2.minValue, 10)}
            maxValue={parseInt(slider2.maxValue, 10)}
            thumbTintColor="orange"
            onValueChanged={(minValue, maxValue) => {
              this.setState({
                slider2: {
                  minValue: Math.min(minValue, maxValue).toFixed(2),
                  maxValue: Math.max(minValue, maxValue).toFixed(2),
                },
              });
            }}
          />
        </View>
        <View style={styles.box}>
          <Text>Custom slider #3</Text>
          <View style={styles.valueBox}>
            <Text>{slider3.minValue || ''}</Text>
            <Text>{slider3.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            // eslint-disable-next-line react-native/no-inline-styles
            thumbStyle={{
              ...styles.shadowStyle,
              width: 10,
              height: 30,
              backgroundColor: '#0ff',
            }}
            minimumValue={0}
            maximumValue={50}
            minValue={parseInt(slider3.minValue, 10)}
            maxValue={parseInt(slider3.maxValue, 10)}
            onValueChanged={(minValue, maxValue) => {
              this.setState({
                slider3: {
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
