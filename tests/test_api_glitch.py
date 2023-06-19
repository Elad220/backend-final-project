import pytest
import requests
import os

# Base URL of your API
BASE_URL = os.environ.get("GLITCH_BASE_URL")
id = "placeholder"
# Test data for expense
expense_data = {
    "user_id": 111111,
    "year": 2023,
    "month": 5,
    "day": 12,
    "description": "test-food",
    "category": "food",
    "sum": 100,
}

# Test data for user
user_data = {
    "id": 111111,
    "first_name": "bot",
    "last_name": "bot",
    "birthday": "March, 12th, 1999",
}


@pytest.fixture(scope="session", autouse=True)
def setup_teardown():
    # Setup
    response = requests.post(f"{BASE_URL}/adduser", json=user_data)
    assert response.status_code == 201

    # Run tests
    yield

    # Teardown
    global id
    url = f"{BASE_URL}/report?user_id={user_data['id']}&year={expense_data['year']}&month={expense_data['month']}"
    response = requests.get(url)
    assert response.status_code == 200
    response = requests.delete(f"{BASE_URL}/removecost", json={"id": id})
    assert response.status_code == 200
    response = requests.delete(f"{BASE_URL}/removeuser", json={"id": user_data["id"]})
    assert response.status_code == 200
    response = requests.delete(
        f"{BASE_URL}/removereport",
        json={
            "user_id": user_data["id"],
            "year": expense_data["year"],
            "month": expense_data["month"],
        },
    )
    assert response.status_code == 200


def test_add_expense():
    global id
    response = requests.post(f"{BASE_URL}/addcost", json=expense_data)
    assert response.status_code == 201
    expense = response.json()
    id = expense["id"]

    assert "id" in expense
    assert "user_id" in expense
    assert "year" in expense
    assert "month" in expense
    assert "day" in expense
    assert "description" in expense
    assert "category" in expense
    assert "sum" in expense

    assert expense["user_id"] == expense_data["user_id"]
    assert expense["year"] == expense_data["year"]
    assert expense["month"] == expense_data["month"]
    assert expense["day"] == expense_data["day"]
    assert expense["description"] == expense_data["description"]
    assert expense["category"] == expense_data["category"]
    assert expense["sum"] == expense_data["sum"]


def test_get_all_expenses():
    print(user_data)
    url = f"{BASE_URL}/report?user_id={user_data['id']}&year={expense_data['year']}&month={expense_data['month']}"
    response = requests.get(url)
    assert response.status_code == 200
    report = response.json()

    assert "food" in report
    assert "health" in report
    assert "housing" in report
    assert "sport" in report
    assert "education" in report
    assert "transportation" in report
    assert "other" in report

    for expense in report["food"]:
        if expense["description"] == expense_data["description"]:
            assert expense["day"] == expense_data["day"]
            assert expense["sum"] == expense_data["sum"]


def test_invalid_expense():
    expense_data["category"] = "invalid_category"
    response = requests.post(f"{BASE_URL}/addcost", json=expense_data)
    assert response.status_code == 400


def test_invalid_user():
    expense_data["user_id"] = 123456
    response = requests.post(f"{BASE_URL}/addcost", json=expense_data)
    assert response.status_code == 400


def test_missing_fields():
    invalid_expense_data = {
        "category": "food",
        "day": 22,
        "month": 5,
        "year": 2023,
        "description": "Groceries",
        "user_id": "123456",
    }
    response = requests.post(f"{BASE_URL}/addcost", json=invalid_expense_data)
    assert response.status_code == 400


def test_invalid_date():
    expense_data["day"] = 32
    response = requests.post(f"{BASE_URL}/addcost", json=expense_data)
    assert response.status_code == 400


def test_about_route():
    response = requests.get(f"{BASE_URL}/about")
    assert response.status_code == 200
