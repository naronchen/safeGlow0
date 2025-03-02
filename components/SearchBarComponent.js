import React from 'react';
import { SearchBar, Icon } from 'react-native-elements';
import { Keyboard, StyleSheet } from 'react-native';

const SearchBarComponent = ({
  search,
  setSearch,
  onFocusCallBack,
  onBlurCallBack,
  onDestinaionClear,
  isSearchPage,
  ...restProps
}) => {
  const handleChangeText = (text) => {
    setSearch(text);
    if (text === "" && onDestinaionClear) {
      onDestinaionClear();
    }
  };

  const handleFocus = () => {
    if (onFocusCallBack) onFocusCallBack();
  };

  const handleBlur = () => {
    Keyboard.dismiss();
    if (onBlurCallBack) onBlurCallBack();
  };

  return (
    <SearchBar
      placeholder="Search"
      onChangeText={handleChangeText}
      value={search}
      containerStyle={styles.searchContainer}
      inputContainerStyle={[
        styles.searchInput,
        isSearchPage && { backgroundColor: '#f2f2f2' },
      ]}
      inputStyle={styles.searchText}
      onFocus={handleFocus}
      searchIcon={
        isSearchPage ? (
          <Icon name="arrow-back" size={24} onPress={handleBlur} />
        ) : (
          <Icon name="search" size={24} />
        )
      }
      {...restProps} // Spread only safe remaining props
    />
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchText: {
    fontSize: 14,
  },
});

export default SearchBarComponent;
