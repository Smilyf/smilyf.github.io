// #include <iostream>
// #include <algorithm>
// #include <vector>
// using namespace std;
// class numx
// {
// public:
//     string n1 = 0, n2 = 0, n3 = 0;
//     bool f = true;
//     numx(string x, string y, string z) : n1(x), n2(y), n3(z)
//     {
//     }
// };
// bool cmp(const numx n1, const numx n2)
// {

//     if (n1.n1 < n2.n1)
//     {

//         return true;
//     }

//     else if (n1.n1 == n2.n1)

//     {
//         if (n1.n2 < n2.n2)
//         {
//             return true;
//         }
//         else if (n1.n2 == n2.n2)
//         {
//             // if (n1.n3 < n2.n3)
//             // {
//             //     return true;
//             // }
//             // else if (n1.n3 == n2.n3)
//             // {
//             //     return false;
//             // }
//             return false;
//         }
//     }

//     return false;
// }
// int main()
// {
//     vector<numx> res;
//     vector<numx> ans;
//     int x = 0, y = 0;
//     cin >> x >> y;

//     int num[7];
//     for (int i = 0; i < 7; i++)
//     {
//         cin >> num[i];
//     }
//     for (int i = 0; i < 7; i++)
//     {
//         int b[6];
//         int k = 0;
//         for (int j = 0; j < 7; j++)
//         {
//             if (i != j)
//             {
//                 b[k] = num[j];
//                 k++;
//             }
//         }
//         do
//         {

//             int num1 = 0;
//             int num2 = 0;
//             int num3 = 0;
//             num1 = b[0] + b[1] + b[2];
//             num2 = b[3] + b[4] + b[5];
//             num3 = x + y + num[i];

//             int x1 = num1 % 10;
//             int x2 = num2 % 10;
//             int x3 = num3 % 10;
//             int x4 = (num1 + num2 + x + y + num[i]) % 10;

//             int nnn1[3];
//             int nnn2[3];
//             int nnn3[3];

//             if (x1 == x2 || x1 == x3 || x2 == x3)
//             {

//                 nnn1[0] = b[0];
//                 nnn1[1] = b[1];
//                 nnn1[2] = b[2];
//                 sort(nnn1, nnn1 + 3);
//                 nnn2[0] = b[3];
//                 nnn2[1] = b[4];
//                 nnn2[2] = b[5];
//                 sort(nnn2, nnn2 + 3);


//                 string tn1="";
//                 string tn2="";
//                 string tn3="";
//                 tn1+=to_string (nnn1[0]);
//                 tn1+=to_string (nnn1[1]);
//                 tn1+=to_string (nnn1[2]);
                 
//                 tn2+=to_string (nnn2[0]);
//                 tn2+=to_string (nnn2[1]);
//                 tn2+=to_string (nnn2[2]);

//                 tn3+=to_string (x);
//                 tn3+=to_string (y);
//                 tn3+=to_string (num[i]);
                
//                 numx t(min(tn1,tn2),max(tn1,tn2),tn3);
//                 res.push_back(t);
//             }

//         } while (next_permutation(b, b + 6));
//     }

//     sort(res.begin(), res.end(), cmp);
//     ans.push_back(res[0]);
//     for (int i = 1; i < res.size(); i++)
//     {
//         if (!(res[i].n1 == res[i - 1].n1 && res[i].n2 == res[i - 1].n2 && res[i].n3 == res[i - 1].n3))
//         {
//            ans.push_back(res[i]);
//         }

//     }
//     cout<<"total: "<<ans.size()<<endl;
//     for (size_t i=0;i<ans.size();i++)
//     {
//         cout <<i<<".   "<< ans[i].n1 << " " <<  ans[i].n2 << " " <<  ans[i].n3 <<"   "<<ans[i].n3[2]<<endl;
           
//     }
//     system("pause");
//     return 0;
// }
// // 2 4
// // 4 7 5 1 3 5 6
