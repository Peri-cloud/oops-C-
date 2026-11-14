#include <iostream>
using namespace std;
int main() {
    int w[4][4] = {{0,2,6,0},{2,0,3,8},{6,3,0,5},{0,8,5,0}};
    bool inTree[4] = {true, false, false, false};
    int total = 0;
    for (int k = 1; k < 4; k++) {
        int best = 1000, bv = -1;
        for (int i = 0; i < 4; i++)
            if (inTree[i])
                for (int j = 0; j < 4; j++)
                    if (!inTree[j] && w[i][j] != 0 && w[i][j] < best) {
                        best = w[i][j];
                        bv = j;
                    }
        inTree[bv] = true;
        total += best;
    }
    cout << total;
    return 0;
}
