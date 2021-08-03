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
    const { slider1, slider2 } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text>Default slider</Text>
          <View style={styles.valueBox}>
            <Text>{slider1.minValue || ''}</Text>
            <Text>{slider1.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            thumbStyle={styles.shadowStyle}
            minValue={0}
            maxValue={1}
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
          <Text>Custom slider</Text>
          <View style={styles.valueBox}>
            <Text>{slider2.minValue || ''}</Text>
            <Text>{slider2.maxValue || ''}</Text>
          </View>
          <DoubleSlider
            style={styles.slider}
            thumbStyle={styles.shadowStyle}
            minimumValue={0}
            maximumValue={30}
            maxValue={10}
            thumbImage={require('./images/thumb.jpg')}
            highlightTrackTintColor="#00f"
            defaultTrackTintColor="#f0f"
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    marginBottom: 20,
    marginHorizontal: 15,
  },
  valueBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slider: {
    marginTop: 10,
  },
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
