#include <iostream>
using namespace std;
int main() {
    int pq[5] = {30, 10, 50, 20, 40};
    int n = 5, maxIdx = 0;
    for (int i = 1; i < n; i++)
        if (pq[i] > pq[maxIdx])
            maxIdx = i;
    cout << pq[maxIdx] << " " << maxIdx;
    return 0;
}
