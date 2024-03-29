// @flow

import type {
  StyleObj,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  ViewPropTypes,
  Platform,
} from 'react-native';
import invariant from 'invariant';

const windowWidth = Dimensions.get('window').width;

type RequiredProps<T> = {
  /**
   * An array of tags, which can be any type, as long as labelExtractor below
   * can extract a string from it
   */
  value: $ReadOnlyArray<T>,
  /**
   * A handler to be called when array of tags change. The parent should update
   * the value prop when this is called if they want to enable removal of tags
   */
  onChange: (items: $ReadOnlyArray<T>) => void,
  /**
   * Function to extract string value for label from item
   */
  labelExtractor: (tagData: T) => string,
  /**
   * The text currently being displayed in the TextInput following the list of
   * tags
   */
  text: string,
  /**
   * This callback gets called when the user types in the TextInput. The parent
   * should update the text prop when this is called if they want to enable
   * input. This is also where any parsing to detect new tags should occur
   */
  onChangeText: (text: string) => void,
};
type OptionalProps = {
  /**
   * Background color of tags
   */
  tagColor: string,
  /**
   * Text color of tags
   */
  tagTextColor: string,
  /**
   * Styling override for container surrounding tag text
   */
  tagContainerStyle?: StyleObj,
  /**
   * Styling override for tag's text component
   */
  tagTextStyle?: StyleObj,
  /**
   * Color of text input
   */
  inputColor: string,
  /**
   * Any misc. TextInput props (autoFocus, placeholder, returnKeyType, etc.)
   */
  inputProps?: $PropertyType<TextInput, 'props'>,
  /**
   * Max height of the tag input on screen (will scroll if max height reached)
   */
  maxHeight: number,
  /**
   * Callback that gets passed the new component height when it changes
   */
  onHeightChange?: (height: number) => void,
};
type Props<T> = RequiredProps<T> & OptionalProps;
type State = {
  inputWidth: number,
  wrapperHeight: number,
};

class TagInput<T> extends React.PureComponent<Props<T>, State> {

  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    labelExtractor: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    tagColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    tagContainerStyle: ViewPropTypes.style,
    tagTextStyle: Text.propTypes.style,
    inputColor: PropTypes.string,
    // $FlowFixMe(>=0.49.0): https://github.com/facebook/react-native/pull/16437
    inputProps: PropTypes.shape(TextInput.propTypes),
    maxHeight: PropTypes.number,
    onHeightChange: PropTypes.func,
  };
  props: Props<T>;
  state: State = {
    inputWidth: 90,
    wrapperHeight: 36,
  };
  wrapperWidth = windowWidth;
  spaceLeft = 0;
  // scroll to bottom
  contentHeight = 0;
  scrollViewHeight = 0;
  // refs
  tagInput: ?TextInput = null;
  scrollView: ?ScrollView = null;

  static defaultProps = {
    tagColor: '#dddddd',
    tagTextColor: '#777777',
    inputColor: '#777777',
    maxHeight: 75,
  };

  static inputWidth(text: string, spaceLeft: number, wrapperWidth: number) {
    if (text === "") {
      return 90;
    } else if (spaceLeft >= 100) {
      return spaceLeft - 10;
    } else {
      return wrapperWidth;
    }
  }

  componentWillReceiveProps(nextProps: Props<T>) {
    const inputWidth = TagInput.inputWidth(
      nextProps.text,
      this.spaceLeft,
      this.wrapperWidth,
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
    const wrapperHeight = Math.min(
      nextProps.maxHeight,
      this.contentHeight,
    );
    if (wrapperHeight !== this.state.wrapperHeight) {
      this.setState({ wrapperHeight });
    }
  }

  componentWillUpdate(nextProps: Props<T>, nextState: State) {
    if (
      this.props.onHeightChange &&
      nextState.wrapperHeight !== this.state.wrapperHeight
    ) {
      this.props.onHeightChange(nextState.wrapperHeight);
    }
  }

  measureWrapper = (event: { nativeEvent: { layout: { width: number } } }) => {
    this.wrapperWidth = event.nativeEvent.layout.width;
    const inputWidth = TagInput.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.wrapperWidth,
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  }

  onBlur = (event: { nativeEvent: { text: string } }) => {
    invariant(Platform.OS === "ios", "only iOS gets text on TextInput.onBlur");
    this.props.onChangeText(event.nativeEvent.text);
  }

  onKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (this.props.text !== '' || event.nativeEvent.key !== 'Backspace') {
      return;
    }
    const tags = [...this.props.value];
    tags.pop();
    this.props.onChange(tags);
    this.focus();
  }

  focus = () => {
    invariant(this.tagInput, "should be set");
    this.tagInput.focus();
  }

  removeIndex = (index: number) => {
    const tags = [...this.props.value];
    tags.splice(index, 1);
    this.props.onChange(tags);
  }

  scrollToBottom = () => {
    // const y = this.contentHeight - this.scrollViewHeight;
    // if (y <= 0) {
    //   return;
    // }
    // const scrollView = this.scrollView;
    // invariant(
    //   scrollView,
    //   "this.scrollView ref should exist before scrollToBottom called",
    // );
    // scrollView.scrollTo({ y, animated: true });
  }

  render() {
    const tags = this.props.value.map((tag, index) => (
      <Tag
        index={index}
        label={this.props.labelExtractor(tag)}
        isLastTag={this.props.value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={this.props.tagColor}
        tagTextColor={'#FFF'}
        tagContainerStyle={this.props.tagContainerStyle}
        tagTextStyle={this.props.tagTextStyle}
        key={index}
      />
    ));

    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onLayout={this.measureWrapper}
      >
        <View style={[styles.wrapper, { height: this.state.wrapperHeight }]}>
          <ScrollView
            ref={this.scrollViewRef}
            style={styles.tagInputContainerScroll}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            onLayout={this.onScrollViewLayout}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.tagInputContainer}>
              {tags}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  tagInputRef = (tagInput: ?React.ElementRef<typeof TextInput>) => {
    invariant(typeof tagInput === "object", "TextInput ref is object");
    this.tagInput = tagInput;
  }

  scrollViewRef = (scrollView: ?React.ElementRef<typeof ScrollView>) => {
    invariant(typeof scrollView === "object", "ScrollView ref is object");
    this.scrollView = scrollView;
  }

  onScrollViewContentSizeChange = (w: number, h: number) => {
    if (this.contentHeight === h) {
      return;
    }
    const nextWrapperHeight = Math.min(this.props.maxHeight, h);
    if (nextWrapperHeight !== this.state.wrapperHeight) {
      this.setState(
        { wrapperHeight: nextWrapperHeight },
        this.contentHeight < h ? this.scrollToBottom : undefined,
      );
    } else if (this.contentHeight < h) {
      this.scrollToBottom();
    }
    this.contentHeight = h;
  }

  onScrollViewLayout = (
    event: { nativeEvent: { layout: { height: number } } },
  ) => {
    this.scrollViewHeight = event.nativeEvent.layout.height;
  }

  onLayoutLastTag = (endPosOfTag: number) => {
    const margin = 3;
    this.spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
    const inputWidth = TagInput.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.wrapperWidth,
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  }

}

type TagProps = {
  index: number,
  label: string,
  isLastTag: bool,
  onLayoutLastTag: (endPosOfTag: number) => void,
  removeIndex: (index: number) => void,
  tagColor: string,
  tagTextColor: string,
  tagContainerStyle?: StyleObj,
  tagTextStyle?: StyleObj,
};
class Tag extends React.PureComponent<TagProps> {

  props: TagProps;
  static propTypes = {
    index: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    isLastTag: PropTypes.bool.isRequired,
    onLayoutLastTag: PropTypes.func.isRequired,
    removeIndex: PropTypes.func.isRequired,
    tagColor: PropTypes.string.isRequired,
    tagTextColor: PropTypes.string.isRequired,
    tagContainerStyle: ViewPropTypes.style,
    tagTextStyle: Text.propTypes.style,
  };
  curPos: ?number = null;

  componentWillReceiveProps(nextProps: TagProps) {
    if (
      !this.props.isLastTag &&
      nextProps.isLastTag &&
      this.curPos !== null &&
      this.curPos !== undefined
    ) {
      this.props.onLayoutLastTag(this.curPos);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        onLayout={this.onLayoutLastTag}
        style={[
          styles.tag,
          { backgroundColor: this.props.tagColor },
          this.props.tagContainerStyle,
        ]}
      >
        <Text style={[
          styles.tagText,
          { color: this.props.tagTextColor },
          this.props.tagTextStyle,
        ]}>
          {this.props.label}
          &nbsp;&times;
        </Text>
      </TouchableOpacity>
    );
  }

  onPress = () => {
    this.props.removeIndex(this.props.index);
  }

  onLayoutLastTag = (
    event: { nativeEvent: { layout: { x: number, width: number } } },
  ) => {
    const layout = event.nativeEvent.layout;
    this.curPos = layout.width + layout.x;
    if (this.props.isLastTag) {
      this.props.onLayoutLastTag(this.curPos);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  tagInputContainerScroll: {
    flex: 1,
  },
  tagInputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 2,
  },
  tag: {
    borderRadius: 2,
    justifyContent: 'center',
  },
  tagText: {
    height: 24,
    borderRadius: 2,
    paddingHorizontal: 8,
    color: '#FFF',
  },
});

export default TagInput;
