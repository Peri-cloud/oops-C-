#include <iostream>
#include <string>
using namespace std;
class Player {
    string name;
    int score;
    static int highest;
    static string topPlayer;
public:
    Player(string n, int s) {
        name = n;
        score = s;
        if (score > highest) {
            highest = score;
            topPlayer = name;
        }
    }
    static int getHighest() {
        return highest;
    }
    static string getTopPlayer() {
        return topPlayer;
    }
};
int Player::highest = 0;
string Player::topPlayer = "None";
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string name;
        int score;
        cin >> name >> score;
        Player p(name, score);
    }
    cout << "Top Player: " << Player::getTopPlayer() << endl;
    cout << "Highest Score: " << Player::getHighest() << endl;
    return 0;
}
