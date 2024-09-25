from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from kind_app.models.kind_act import KindAct  # Ensure this import is correct

class KindActViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.kind_act_url = reverse('kind-acts-api')  # URL for the list and create endpoint
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='password')

    def test_kind_act_GET_user_not_authenticated(self):
        response = self.client.get(self.kind_act_url)
        self.assertEqual(response.status_code, 403)

    def test_kind_act_GET_user_authenticated_no_accounts(self):
        self.client.login(username='testuser', password='password')
        response = self.client.get(self.kind_act_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)  # Assert that no entries are returned

    def test_kind_act_GET_user_authenticated_with_accounts(self):
        self.client.login(username='testuser', password='password')
        KindAct.objects.create(user=self.user, content='Test Act Content')
        response = self.client.get(self.kind_act_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Ensure that we received one entry

    def test_kind_act_GET_admin_user(self):
        admin_user = User.objects.create_superuser(username='adminuser', email='admin@example.com', password='adminpass')
        self.client.login(username='adminuser', password='adminpass')
        KindAct.objects.create(user=self.user, content='User Act Content')
        KindAct.objects.create(user=admin_user, content='Admin Act Content')
        response = self.client.get(self.kind_act_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Assert admin can see both entries

    def test_kind_act_POST_authenticated_user(self):
        self.client.login(username='testuser', password='password')
        response = self.client.post(self.kind_act_url, {'content': 'New Act Content'})
        self.assertEqual(response.status_code, 201)  # Check for success response
        self.assertEqual(KindAct.objects.count(), 1)  # Assert one KindAct created
        self.assertEqual(KindAct.objects.first().content, 'New Act Content')  # Verify content

    def test_kind_act_PUT_authenticated_user(self):
        self.client.login(username='testuser', password='password')
        kind_act = KindAct.objects.create(user=self.user, content='Old Content')
        response = self.client.put(self.kind_act_url, {'id': kind_act.pk, 'content': 'Updated Content'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)  # Expecting success for updating
        kind_act.refresh_from_db()  # Refresh to get the updated instance
        self.assertEqual(kind_act.content, 'Updated Content')  # Assert the content has been updated

    def test_kind_act_DELETE_authenticated_user(self):
        self.client.login(username='testuser', password='password')
        kind_act = KindAct.objects.create(user=self.user, content='Delete Me Content')
        response = self.client.delete(self.kind_act_url, {'ids': [kind_act.pk]}, content_type='application/json')
        self.assertEqual(response.status_code, 204)  # Expecting no content response
        self.assertEqual(KindAct.objects.count(), 0)  # Assert the KindAct has been deleted
