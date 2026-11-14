#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
};
TrieNode* createNode() {
    TrieNode* node = new TrieNode;
    for (int i = 0; i < 26; i++) {
        node->children[i] = NULL;
    }
    node->isEnd = false;
    return node;
}
class Trie {
    TrieNode* root;
public:
    Trie() {
        root = createNode();
    }
    void insert(string word) {
        TrieNode* temp = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word[i] - 'a';
            if (temp->children[index] == NULL) {
                temp->children[index] = createNode();
            }
            temp = temp->children[index];
        }
        temp->isEnd = true;
    }
    string search(string word) {
        TrieNode* temp = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word[i] - 'a';
            if (temp->children[index] == NULL) {
                return "Not Found";
            }
            temp = temp->children[index];
        }
        if (temp->isEnd) {
            return "Found";
        }
        return "Not Found";
    }
};
int main() {
    int n, q;
    cin >> n;
    Trie t;
    for (int i = 0; i < n; i++) {
        string word;
        cin >> word;
        t.insert(word);
    }
    cin >> q;
    for (int i = 0; i < q; i++) {
        string word;
        cin >> word;
        cout << word << ": " << t.search(word) << endl;
    }
    return 0;
}
