# 🔍 Search/Vocabulary Feature

## Overview
The new Search/Vocabulary section allows you to discover Norwegian words using the official Norwegian Dictionary API (ord.uib.no). This feature makes it easy to find new words, learn their meanings, and add them directly to your learning list.

## 🚀 How to Use

### 1. Accessing the Search Feature
- Navigate to the **Search** tab in the main navigation
- Or use the **Search Dictionary** quick action from the Dashboard

### 2. Basic Search
1. **Enter a search term** in the search box
2. **Click Search** or press Enter
3. **Browse results** organized by match type
4. **Click on any word** to see detailed information
5. **Add words** to your vocabulary with the + button

### 3. Advanced Search Features

#### **Filters**
- **Word Class**: Filter by noun, verb, adjective, etc.
- **Max Results**: Choose how many results to display (5-50)
- **Dictionaries**: Search in Bokmål, Nynorsk, or both

#### **Search Types**
- **Exact Matches**: Words that exactly match your search
- **Inflected Forms**: Different grammatical forms of words
- **Freetext Matches**: Words found in definitions/examples
- **Similar Words**: Words that are similar to your search

#### **Wildcard Search**
- Use `*` to match any number of characters
- Use `_` to match a single character
- Examples:
  - `katt*` finds: katt, katter, katten, etc.
  - `_c*` finds words with 'c' as the second letter
  - `*ø*` finds words containing 'ø'

## 🎯 Features

### **Word Discovery**
- **Official API**: Uses the authoritative Norwegian dictionary
- **Multiple Sources**: Search both Bokmål and Nynorsk
- **Rich Results**: Get definitions, examples, and grammar info

### **Learning Integration**
- **Direct Addition**: Add words to your vocabulary instantly
- **Pronunciation**: Listen to words using text-to-speech
- **Detailed Info**: See comprehensive word information

### **User Experience**
- **Recent Searches**: Quick access to previous searches
- **Smart Filters**: Narrow down results by word type
- **Responsive Design**: Works on all device sizes

## 📚 Search Examples

### **Basic Words**
- Search: `hei` → Find: hei, heia, heie
- Search: `takk` → Find: takk, takke, takker

### **Wildcard Searches**
- Search: `katt*` → Find: katt, katter, katten, kattunge
- Search: `*øl*` → Find: øl, ølet, ølflaske, ølglass

### **Word Class Filtering**
- Search: `lys` + Word Class: `ADJ` → Find only adjectives
- Search: `gå` + Word Class: `VERB` → Find only verbs

## 🔧 Technical Details

### **API Endpoints Used**
- **Suggest API**: `/api/suggest` for word search
- **Articles API**: `/api/articles` for word details
- **Article Content**: `/dict/article/{id}.json` for full definitions

### **Data Sources**
- **Bokmål (bm)**: Standard Norwegian
- **Nynorsk (nn)**: New Norwegian
- **Official Dictionary**: University of Bergen (UiB)

### **Response Format**
```json
{
  "query": "search term",
  "totalCount": 15,
  "exactMatches": [...],
  "inflectedForms": [...],
  "freetextMatches": [...],
  "similarWords": [...]
}
```

## 💡 Tips for Best Results

### **Search Strategies**
1. **Start Simple**: Begin with basic word searches
2. **Use Wildcards**: Expand results with `*` and `_`
3. **Filter Results**: Use word class filters for specific types
4. **Try Variations**: Search for different forms of words

### **Word Discovery**
1. **Browse Results**: Look through all match types
2. **Check Context**: Read definitions and examples
3. **Listen First**: Use pronunciation before adding words
4. **Start Small**: Begin with common, everyday words

### **Learning Integration**
1. **Add Gradually**: Don't add too many words at once
2. **Review Regularly**: Use flashcards and practice mode
3. **Build Context**: Learn words in example sentences
4. **Track Progress**: Monitor your learning journey

## 🎨 User Interface

### **Search Results Display**
- **Word Cards**: Each result shows word, type, and dictionaries
- **Quick Actions**: Listen and add buttons on each result
- **Visual Feedback**: Selected words are highlighted
- **Responsive Layout**: Adapts to different screen sizes

### **Word Details Panel**
- **Comprehensive Info**: Definitions, examples, and grammar
- **Pronunciation**: Built-in text-to-speech
- **External Links**: Direct access to full dictionary entries
- **Add to Vocabulary**: One-click word addition

## 🔗 Integration Points

### **With Existing Features**
- **Vocabulary Management**: Words added here appear in "My Words"
- **Flashcards**: New words automatically included in study sessions
- **Practice Mode**: Integrated into spaced repetition system
- **Progress Tracking**: Contributes to learning statistics

### **Data Flow**
1. **Search** → Norwegian Dictionary API
2. **Select Word** → Fetch detailed information
3. **Add Word** → Store in local vocabulary
4. **Learn** → Use in flashcards and practice

## 🚀 Future Enhancements

### **Planned Features**
- **Favorite Words**: Save interesting words for later
- **Search History**: Track all your searches over time
- **Word Lists**: Create themed vocabulary collections
- **Advanced Filters**: More sophisticated search options
- **Offline Mode**: Cache frequently searched words

### **API Improvements**
- **Better Parsing**: Enhanced definition extraction
- **Grammar Details**: More comprehensive word information
- **Etymology**: Word origin and history
- **Usage Examples**: Real-world sentence examples

## 🎯 Benefits

### **For Learners**
- **Discover New Words**: Find vocabulary you didn't know existed
- **Official Sources**: Learn from authoritative Norwegian dictionaries
- **Context-Rich**: Understand words with definitions and examples
- **Integrated Learning**: Seamlessly add words to your study routine

### **For the App**
- **Enhanced Functionality**: More comprehensive vocabulary tool
- **Professional Quality**: Official API integration
- **User Engagement**: Interactive word discovery experience
- **Learning Growth**: Natural vocabulary expansion

---

**Start exploring Norwegian vocabulary today!** 🇳🇴✨

Use the Search feature to discover new words, learn their meanings, and build your Norwegian vocabulary systematically.
