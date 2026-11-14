#include <iostream>
using namespace std;
int main() {
    int u[4] = {0, 0, 1, 2};
    int v[4] = {1, 2, 2, 3};
    int w[4] = {4, 5, -3, 2};
    int dist[4] = {0, 1000, 1000, 1000};
    for (int pass = 1; pass <= 3; pass++)
        for (int e = 0; e < 4; e++)
            if (dist[u[e]] != 1000 && dist[u[e]] + w[e] < dist[v[e]])
                dist[v[e]] = dist[u[e]] + w[e];
    for (int i = 0; i < 4; i++)
        cout << dist[i] << " ";
    return 0;
}
